/**
 * Critical test 1 (docs/11-ROADMAP.md WU-02): two concurrent bookings of the same chair,
 * exactly one succeeds.
 *
 * This is the invariant the inherited system could not express: it counted turnos in the
 * browser and then inserted, so two receptionists could seat two patients on one chair.
 * Here the EXCLUDE constraint decides, and the loser gets a real error.
 *
 * Skipped when DATABASE_URL_DIRECT is absent, so CI stays green without a database.
 */
import { neon } from "@neondatabase/serverless"
import { afterAll, describe, expect, it } from "vitest"

const url = process.env.DATABASE_URL_DIRECT
const sql = url ? neon(url) : null

const SALA = "TEST sillon exclusivo"

afterAll(async () => {
  if (!sql) return
  await sql.query("delete from turnos where sala_id in (select id from salas where nombre = $1)", [SALA])
  await sql.query("delete from salas where nombre = $1", [SALA])
})

describe.skipIf(!sql)("EXCLUDE de sillon", () => {
  it("dos reservas simultaneas del mismo sillon: entra exactamente una", async () => {
    const [sala] = await sql!.query(
      "insert into salas (nombre, tipo, capacidad) values ($1, 'sueros', 2) returning id",
      [SALA],
    )
    const salaId = sala.id

    const reservar = (nombre: string) =>
      sql!.query(
        "insert into turnos (paciente_nombre, sala_id, puesto, inicio, fin) values ($1, $2, 1, $3, $4)",
        [nombre, salaId, "2026-10-01T13:00:00Z", "2026-10-01T14:00:00Z"],
      )

    const resultados = await Promise.allSettled([reservar("Paciente A"), reservar("Paciente B")])

    const entraron = resultados.filter((r) => r.status === "fulfilled")
    const rechazadas = resultados.filter((r) => r.status === "rejected")

    expect(entraron).toHaveLength(1)
    expect(rechazadas).toHaveLength(1)

    const [conteo] = await sql!.query(
      "select count(*)::int as n from turnos where sala_id = $1 and puesto = 1",
      [salaId],
    )
    expect(conteo.n).toBe(1)
  })

  it("el segundo sillon de la misma sala queda libre", async () => {
    const [sala] = await sql!.query("select id from salas where nombre = $1", [SALA])

    await sql!.query(
      "insert into turnos (paciente_nombre, sala_id, puesto, inicio, fin) values ($1, $2, 2, $3, $4)",
      ["Paciente C", sala.id, "2026-10-01T13:00:00Z", "2026-10-01T14:00:00Z"],
    )

    const [conteo] = await sql!.query(
      "select count(*)::int as n from turnos where sala_id = $1",
      [sala.id],
    )
    expect(conteo.n).toBe(2)
  })

  it("una reserva cancelada libera el sillon", async () => {
    const [sala] = await sql!.query("select id from salas where nombre = $1", [SALA])

    await sql!.query(
      "insert into turnos (paciente_nombre, sala_id, puesto, inicio, fin, estado) values ($1, $2, 1, $3, $4, 'CANCELADO')",
      ["Paciente D", sala.id, "2026-10-01T13:00:00Z", "2026-10-01T14:00:00Z"],
    )

    const [conteo] = await sql!.query(
      "select count(*)::int as n from turnos where sala_id = $1 and puesto = 1",
      [sala.id],
    )
    expect(conteo.n).toBe(2)
  })
})
