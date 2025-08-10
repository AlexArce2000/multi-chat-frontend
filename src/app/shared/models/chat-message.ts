export interface ChatMessage {
    id: string;
    salaId: string;
    remitente: string;
    contenido: string;
    timestamp: string; // O Date, pero string es más seguro para la deserialización inicial
}