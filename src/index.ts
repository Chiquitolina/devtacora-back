import express, { Response, Request } from "express";
import path from "path";
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from "./config/tRCP";
import { appRouter } from "./config/appRouter";

const app = express();
const PORT = process.env.PORT || 3000;

//app.use(morgan("dev"));

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:4200'],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,  // Usar el appRouter
      createContext,      // Aquí reutilizas el contexto definido en tRPC.ts
    }),
  );

// Asegúrate de servir la carpeta 'public' correctamente
app.use("/", express.static(path.join(__dirname, "/public")));

// Manejar rutas no encontradas
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});