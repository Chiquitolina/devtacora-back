import { t } from "../config/tRCP";
import { z } from "zod";

// Reemplazá con tus credenciales de LinkedIn
const clientId = "77iqo5a1iv52pi";
const clientSecret = "WPL_AP1.anm7UyYkkrrHyRJR.lfkTYw==";
const redirectUri = "http://localhost:4200/auth/linkedin/callback";

// Definí el esquema de input con Zod
const inputSchema = z.object({
  code: z.string(),
});

export const linkedinRouter = t.router({
  getAccessToken: t.procedure
    .input(inputSchema) // Usamos el esquema definido
    .query(async ({ input }: { input: z.infer<typeof inputSchema> }) => {
      // Especificamos el tipo de input
      try {
        const response = await fetch(
          "https://www.linkedin.com/oauth/v2/accessToken",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: input.code,
              redirect_uri: redirectUri,
              client_id: clientId,
              client_secret: clientSecret,
            }),
          }
        );

        if (!response.ok) {
          console.error("Error en la respuesta:", await response.text());
          throw new Error("Error al obtener el access_token");
        }

        const data = await response.json();
        const accessToken = data.access_token;
        return { accessToken };
      } catch (error) {
        console.error("Error al obtener el access_token:", error);
        throw new Error("Fallo en obtener el access_token");
      }
    }),
    getUserProfile: t.procedure
  .input(z.object({ accessToken: z.string() }))  // Usando z.any() para descartar problemas de validación
  .mutation(async ({ input }) => {

    // Acceder al accessToken dentro del anidamiento
    const { accessToken } = input;

    if (!accessToken) {
      console.error("No se recibió un Access Token válido.");
      throw new Error("No se recibió un Access Token válido.");
    }

    try {
      console.log("Iniciando petición a LinkedIn...");

      const response = await fetch("https://api.linkedin.com/v2/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Cache-Control": "no-cache",
        },
      });

      console.log("Status de la respuesta de LinkedIn:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Error al obtener el perfil de LinkedIn:",
          response.status,
          errorText
        );
        throw new Error("No se pudo obtener el perfil de LinkedIn");
      }

      const data = await response.json();
      console.log("Datos recibidos de LinkedIn:", data);
      return data;
    } catch (error) {
      console.error("Error en la petición:", error);
      throw new Error("Error al obtener el perfil de LinkedIn");
    }
  }),
});
