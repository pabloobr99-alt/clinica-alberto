"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Reserva = {
  motivo: string;
  fecha: string;
  hora: string;
};

export default function DatosPage() {
  const [reserva, setReserva] = useState<Reserva | null>(null);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const reservaGuardada =
      sessionStorage.getItem("reserva");

    if (!reservaGuardada) {
      window.location.href = "/reservar";
      return;
    }

    try {
      const datos = JSON.parse(reservaGuardada);

      setReserva(datos);
    } catch {
      window.location.href = "/reservar";
    }
  }, []);

  const formatearFecha = (fecha: string) => {
    const [year, month, day] = fecha.split("-");

    const fechaObjeto = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return fechaObjeto.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const enviarReserva = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!reserva) {
      return;
    }

    setError("");

    if (!nombre.trim()) {
      setError("Introduce tu nombre.");
      return;
    }

    if (!telefono.trim()) {
      setError("Introduce tu teléfono.");
      return;
    }

    if (!email.trim()) {
      setError("Introduce tu email.");
      return;
    }

    setEnviando(true);

    const { error: supabaseError } =
      await supabase.rpc(
        "crear_cita_con_paciente",
        {
          p_nombre: nombre.trim(),
          p_telefono: telefono.trim(),
          p_email: email.trim(),
          p_motivo: reserva.motivo || "",
          p_fecha: reserva.fecha,
          p_hora: reserva.hora,
        }
      );

    if (supabaseError) {
      console.error(
        "Error creando reserva:",
        supabaseError
      );

      if (supabaseError.code === "23505") {
        setError(
          "Ese horario acaba de ser ocupado. Vuelve a elegir otra hora."
        );
      } else {
        setError(
          "No hemos podido completar la reserva. Inténtalo de nuevo."
        );
      }

      setEnviando(false);
      return;
    }

    sessionStorage.removeItem("reserva");

    window.location.href = "/confirmacion";
  };

  if (!reserva) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F7F9]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#0A3653]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7F9] px-4 py-10 text-[#0A3653] sm:px-6">

      <div className="mx-auto max-w-2xl">

        {/* CABECERA */}

        <div className="mb-8">

          <a
            href="/fecha"
            className="text-sm font-semibold text-slate-500 transition hover:text-[#0A3653]"
          >
            ← Volver a elegir horario
          </a>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-[#B1263A]">
            Último paso
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Tus datos
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Necesitamos estos datos para poder gestionar
            tu solicitud de cita.
          </p>

        </div>

        {/* RESUMEN */}

        <div className="mb-6 rounded-3xl bg-[#0A3653] p-6 text-white shadow-lg">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            Tu reserva
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <div>
              <p className="text-xs text-white/50">
                Fecha
              </p>

              <p className="mt-1 font-semibold capitalize">
                {formatearFecha(reserva.fecha)}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/50">
                Hora
              </p>

              <p className="mt-1 font-semibold">
                {reserva.hora}
              </p>
            </div>

          </div>

          {reserva.motivo && (
            <div className="mt-5 border-t border-white/10 pt-5">

              <p className="text-xs text-white/50">
                Motivo de consulta
              </p>

              <p className="mt-1 text-sm leading-relaxed text-white/90">
                {reserva.motivo}
              </p>

            </div>
          )}

        </div>

        {/* FORMULARIO */}

        <form
          onSubmit={enviarReserva}
          className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
        >

          <div className="mb-7">

            <h2 className="text-xl font-bold">
              Datos de contacto
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Alberto utilizará estos datos para gestionar
              tu solicitud.
            </p>

          </div>

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Nombre completo
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(event) =>
                  setNombre(event.target.value)
                }
                placeholder="Tu nombre"
                autoComplete="name"
                className="w-full rounded-xl border border-slate-200 bg-[#F9FBFC] px-4 py-3.5 text-sm outline-none transition focus:border-[#0A3653]"
              />

            </div>

            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Teléfono
              </label>

              <input
                type="tel"
                value={telefono}
                onChange={(event) =>
                  setTelefono(event.target.value)
                }
                placeholder="600 000 000"
                autoComplete="tel"
                className="w-full rounded-xl border border-slate-200 bg-[#F9FBFC] px-4 py-3.5 text-sm outline-none transition focus:border-[#0A3653]"
              />

            </div>

            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="tu@email.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-[#F9FBFC] px-4 py-3.5 text-sm outline-none transition focus:border-[#0A3653]"
              />

            </div>

          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-7 w-full rounded-xl bg-[#0A3653] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#082b43] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando
              ? "Enviando solicitud..."
              : "Solicitar cita →"}
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
            La cita quedará pendiente de confirmación
            por parte de la clínica.
          </p>

        </form>

      </div>

    </main>
  );
}