import { Persona } from './CRUDPersonaExistente';

export class CRUDPersonaExistenteRequest {
    idPersona: number;
    accion: string;
    persona: Persona;
}

