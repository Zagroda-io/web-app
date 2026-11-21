/** @type {import('next').NextConfig} */
const nextConfig = {
  // Samodzielny serwer (.next/standalone) z tylko potrzebnymi zależnościami — z niego powstaje obraz Dockera.
  output: "standalone",
  async redirects() {
    return [
      // Lista alertów przeniesiona ze Stada pod Czujniki. Bez przekierowania stary adres
      // trafiałby w profil krowy /dashboard/stado/[id] z ID „alerty".
      {
        source: "/dashboard/stado/alerty",
        destination: "/dashboard/czujniki/alerty",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
