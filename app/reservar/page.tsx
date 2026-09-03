"use client";

import { useState } from "react";

export default function Reservar() {
  const [motivo, setMotivo] = useState("");

  const continuar = () => {
    if (!motivo.trim()) {
      alert("Cuéntanos brevemente qué te ocurre para continuar.");
      return;
    }

    sessionStorage.setItem(
      "reserva",
      JSON.stringify({
        motivo,
      })
    );

    window.location.href = "/fecha";
  };

  return (
    <main className="min-h-screen bg-[#F5F7F8] px-6 py-12">
      <div className="mx-auto w-full max-w-3xl">

        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0A3653] transition hover:text-[#B1263A]"
        >
          ← Volver a la clínica
        </a>

        <div className="mt-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#B1263A]">
            Solicitar cita
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#0A3653] sm:text-5xl">
            Cuéntanos qué te ocurre.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Explícanos brevemente qué molestias tienes, dónde las notas
            y desde cuándo. Alberto revisará la información para valorar
            cómo puede ayudarte.
          </p>
        </div>

        <div className="mt-12 rounded-[2rem] bg-white p-6 shadow-sm sm:p-10">
          <label
            htmlFor="motivo"
            className="text-sm font-bold uppercase tracking-[0.18em] text-[#0A3653]"
          >
            Motivo de consulta
          </label>

          <textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={8}
            placeholder="Por ejemplo: tengo molestias en la zona lumbar desde hace unos días..."
            className="mt-5 w-full resize-none rounded-2xl border border-slate-200 bg-[#F8FAFB] px-5 py-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0A3653] focus:bg-white focus:ring-4 focus:ring-[#0A3653]/10"
          />

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Cuéntanos lo que consideres importante. Esta información ayudará
            a Alberto a conocer mejor tu situación antes de la cita.
          </p>
        </div>

        <button
          type="button"
          onClick={continuar}
          className="group mt-8 flex w-full items-center justify-center gap-4 rounded-full bg-[#0A3653] px-6 py-5 text-lg font-semibold text-white transition duration-500 hover:bg-[#B1263A] hover:shadow-xl"
        >
          Elegir fecha y hora
          <span className="transition-transform duration-500 group-hover:translate-x-2">
            →
          </span>
        </button>

        <p className="mt-5 text-center text-sm text-slate-400">
          La duración de cada sesión es de 1 hora.
        </p>
      </div>
    </main>
  );
}