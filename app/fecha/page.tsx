"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const HORAS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const DIAS = [
  "Dom",
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
];

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

type Cita = {
  fecha: string;
  hora: string;
  estado: string | null;
};

const formatearFecha = (fecha: Date) => {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
};

const esMismaFecha = (a: Date, b: Date) => {
  return formatearFecha(a) === formatearFecha(b);
};

export default function FechaPage() {
  const hoy = useMemo(() => {
    const fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  }, []);

  const [mesActual, setMesActual] = useState(
    new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  );

  const [fechaSeleccionada, setFechaSeleccionada] =
    useState<Date | null>(null);

  const [horaSeleccionada, setHoraSeleccionada] =
    useState<string | null>(null);

  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // CARGAR CITAS DEL MES
  // --------------------------------------------------

  useEffect(() => {
    cargarDisponibilidad();
  }, [mesActual]);

  const cargarDisponibilidad = async () => {
    setCargando(true);
    setError("");

    const primerDia = new Date(
      mesActual.getFullYear(),
      mesActual.getMonth(),
      1
    );

    const ultimoDia = new Date(
      mesActual.getFullYear(),
      mesActual.getMonth() + 1,
      0
    );

    const { data, error } = await supabase
      .from("citas")
      .select("fecha,hora,estado")
      .gte("fecha", formatearFecha(primerDia))
      .lte("fecha", formatearFecha(ultimoDia))
      .in("estado", ["pendiente", "confirmada"]);

    if (error) {
      console.error("ERROR CARGANDO DISPONIBILIDAD:", error);
      setError(
        "No hemos podido comprobar la disponibilidad. Inténtalo de nuevo."
      );
      setCitas([]);
      setCargando(false);
      return;
    }

    setCitas(data || []);
    setCargando(false);
  };

  // --------------------------------------------------
  // COMPROBAR SI UNA HORA ESTÁ OCUPADA
  // --------------------------------------------------

  const estaOcupada = (fecha: Date, hora: string) => {
    const fechaTexto = formatearFecha(fecha);

    return citas.some(
      (cita) =>
        cita.fecha === fechaTexto &&
        cita.hora === hora &&
        (cita.estado === "pendiente" ||
          cita.estado === "confirmada")
    );
  };

  // --------------------------------------------------
  // GENERAR CALENDARIO
  // --------------------------------------------------

  const diasCalendario = useMemo(() => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();

    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);

    const primerDiaSemana = primerDia.getDay();
    const totalDias = ultimoDia.getDate();

    const dias: (Date | null)[] = [];

    // Huecos antes del día 1
    for (let i = 0; i < primerDiaSemana; i++) {
      dias.push(null);
    }

    // Días del mes
    for (let dia = 1; dia <= totalDias; dia++) {
      dias.push(new Date(año, mes, dia));
    }

    return dias;
  }, [mesActual]);

  // --------------------------------------------------
  // CAMBIAR MES
  // --------------------------------------------------

  const cambiarMes = (cantidad: number) => {
    setMesActual(
      new Date(
        mesActual.getFullYear(),
        mesActual.getMonth() + cantidad,
        1
      )
    );

    setFechaSeleccionada(null);
    setHoraSeleccionada(null);
  };

  // --------------------------------------------------
  // SELECCIONAR DÍA
  // --------------------------------------------------

  const seleccionarDia = (fecha: Date) => {
    if (fecha < hoy) return;

    // Domingo
    if (fecha.getDay() === 0) return;

    // Sábado
    if (fecha.getDay() === 6) return;

    setFechaSeleccionada(fecha);
    setHoraSeleccionada(null);
  };

  // --------------------------------------------------
  // CONTINUAR
  // --------------------------------------------------

  const continuar = () => {
    if (!fechaSeleccionada || !horaSeleccionada) return;

    const reservaAnterior = sessionStorage.getItem("reserva");

    const reserva = reservaAnterior
      ? JSON.parse(reservaAnterior)
      : {};

    const reservaActualizada = {
      ...reserva,
      fecha: formatearFecha(fechaSeleccionada),
      hora: horaSeleccionada,
    };

    sessionStorage.setItem(
      "reserva",
      JSON.stringify(reservaActualizada)
    );

    window.location.href = "/datos";
  };

  // --------------------------------------------------
  // INFORMACIÓN DEL DÍA
  // --------------------------------------------------

  const horasDisponibles = fechaSeleccionada
    ? HORAS.filter(
        (hora) => !estaOcupada(fechaSeleccionada, hora)
      )
    : [];

  return (
    <main className="min-h-screen bg-white text-[#0A3653]">

      {/* HEADER */}

      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <a
            href="/"
            className="text-sm font-bold tracking-tight"
          >
            Clínica de Osteopatía
          </a>

          <a
            href="/reservar"
            className="text-sm font-semibold text-slate-400 transition hover:text-[#0A3653]"
          >
            ← Volver
          </a>

        </div>
      </header>

      {/* CONTENIDO */}

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">

        {/* PROGRESO */}

        <div className="mb-12">

          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]">

            <span className="text-[#B1263A]">
              02
            </span>

            <span className="text-slate-300">
              /
            </span>

            <span className="text-slate-400">
              03
            </span>

          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Elige el momento
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Selecciona un día y después una hora disponible.
            Las horas ocupadas se actualizan directamente desde
            nuestra agenda.
          </p>

        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* CALENDARIO */}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_70px_rgba(10,54,83,0.07)] sm:p-8">

          {/* CABECERA MES */}

          <div className="mb-8 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Disponibilidad
              </p>

              <h2 className="mt-1 text-2xl font-bold capitalize">
                {MESES[mesActual.getMonth()]}{" "}
                {mesActual.getFullYear()}
              </h2>
            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() => cambiarMes(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-lg transition hover:border-[#0A3653] hover:bg-[#F7F9FA]"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => cambiarMes(1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-lg transition hover:border-[#0A3653] hover:bg-[#F7F9FA]"
              >
                →
              </button>

            </div>

          </div>

          {/* DÍAS SEMANA */}

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">

            {DIAS.map((dia) => (
              <div
                key={dia}
                className="pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400"
              >
                {dia}
              </div>
            ))}

            {/* DÍAS */}

            {diasCalendario.map((fecha, indice) => {

              if (!fecha) {
                return (
                  <div
                    key={`empty-${indice}`}
                    className="aspect-square"
                  />
                );
              }

              const esPasado = fecha < hoy;

              const esFinDeSemana =
                fecha.getDay() === 0 ||
                fecha.getDay() === 6;

              const seleccionada =
                fechaSeleccionada &&
                esMismaFecha(
                  fecha,
                  fechaSeleccionada
                );

              const esHoy = esMismaFecha(fecha, hoy);

              const deshabilitada =
                esPasado || esFinDeSemana;

              return (
                <button
                  key={fecha.toISOString()}
                  type="button"
                  disabled={deshabilitada}
                  onClick={() => seleccionarDia(fecha)}
                  className={`relative aspect-square rounded-2xl text-sm font-semibold transition ${
                    deshabilitada
                      ? "cursor-not-allowed text-slate-200"
                      : seleccionada
                      ? "bg-[#0A3653] text-white shadow-lg shadow-[#0A3653]/20"
                      : "text-[#0A3653] hover:bg-[#F0F5F7]"
                  }`}
                >

                  {fecha.getDate()}

                  {esHoy && !seleccionada && (
                    <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#B1263A]" />
                  )}

                </button>
              );
            })}

          </div>

          {/* LEYENDA */}

          <div className="mt-7 flex flex-wrap gap-5 border-t border-slate-100 pt-6 text-xs text-slate-400">

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0A3653]" />
              Disponible
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-200" />
              No disponible
            </div>

          </div>

        </section>

        {/* HORAS */}

        {fechaSeleccionada && (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_70px_rgba(10,54,83,0.05)] sm:p-8">

            <div className="mb-6">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B1263A]">
                Horarios
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {fechaSeleccionada.toLocaleDateString(
                  "es-ES",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  }
                )}
              </h2>

            </div>

            {cargando ? (

              <div className="flex items-center gap-3 py-8 text-sm text-slate-400">

                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#0A3653]" />

                Comprobando disponibilidad...

              </div>

            ) : horasDisponibles.length === 0 ? (

              <div className="rounded-2xl bg-slate-50 p-6 text-center">

                <p className="font-semibold">
                  No quedan horas disponibles este día.
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Prueba con otro día.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                {HORAS.map((hora) => {

                  const ocupada = estaOcupada(
                    fechaSeleccionada,
                    hora
                  );

                  const seleccionada =
                    horaSeleccionada === hora;

                  return (
                    <button
                      key={hora}
                      type="button"
                      disabled={ocupada}
                      onClick={() =>
                        setHoraSeleccionada(hora)
                      }
                      className={`rounded-2xl border px-4 py-4 text-sm font-bold transition ${
                        ocupada
                          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-200 line-through"
                          : seleccionada
                          ? "border-[#0A3653] bg-[#0A3653] text-white shadow-lg shadow-[#0A3653]/20"
                          : "border-slate-200 bg-white text-[#0A3653] hover:border-[#0A3653] hover:bg-[#F7F9FA]"
                      }`}
                    >
                      {hora}
                    </button>
                  );
                })}

              </div>

            )}

          </section>
        )}

        {/* CONTINUAR */}

        <div className="mt-8 flex justify-end">

          <button
            type="button"
            disabled={
              !fechaSeleccionada ||
              !horaSeleccionada
            }
            onClick={continuar}
            className={`w-full rounded-2xl px-6 py-4 text-sm font-bold transition sm:w-auto sm:min-w-[220px] ${
              fechaSeleccionada && horaSeleccionada
                ? "bg-[#B1263A] text-white shadow-lg shadow-[#B1263A]/20 hover:-translate-y-0.5 hover:bg-[#981F31]"
                : "cursor-not-allowed bg-slate-100 text-slate-300"
            }`}
          >
            Continuar →
          </button>

        </div>

      </div>

    </main>
  );
}