import { PontoDTO, PontoReportDTO } from "./dto";

export interface IPontoUseCase {
    create(usuarioId: string): Promise<PontoDTO>;
    getAllByUsuarioId(usuarioId: string): Promise<PontoReportDTO[]>;
    getEmailReportByUsuarioId(usuarioId: string): Promise<void>;
}
