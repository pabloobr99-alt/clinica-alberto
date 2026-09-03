export default function Confirmacion() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 flex items-center">
      <div className="mx-auto w-full max-w-2xl text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0A3653]">
          <span className="text-4xl text-white">✓</span>
        </div>

        <p className="mt-8 text-sm font-medium tracking-widest text-[#B1263A] uppercase">
          Solicitud recibida
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#0A3653]">
          ¡Gracias por confiar en nosotros!
        </h1>

        <p className="mt-5 text-gray-600 leading-relaxed">
          Hemos recibido tu solicitud de cita correctamente.
          Alberto revisará la información y se pondrá en contacto contigo
          para confirmar la cita.
        </p>

        <a
          href="/"
          className="mt-8 inline-block rounded-xl bg-[#0A3653] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#B1263A]"
        >
          Volver al inicio
        </a>

      </div>
    </main>
  );
}