
export default interface ClientResponse {
  body: ClientResponseBody;
  header: ClientResponseHeader;
}

export interface ClientResponseBody {
  eventName: string;
  measurements: any;
  properties: ClientResponseBodyProperties;
}

export interface ClientResponseHeader {
  messagePurpose: string;
  requestId: string;
  version: number;
}

export interface ClientResponseBodyProperties {
  AccountType: number;
  ActiveSessionID: string;
  AppSessionID: string;
  Biome: number;
  Build: string;
  BuildPlat: number;
  Cheevos: boolean;
  ClientId: string;
  CurrentInput: number;
  CurrentNumDevices: number;
  DeviceSessionId: string;
  Dim: number;
  GlobalMultiplayerCorrelationId: string;
  Message: string;
  MessageType: string;
  Mode: number;
  MultiplayerCorrelationId: string;
  NetworkType: number;
  Plat: string;
  PlayerGameMode: number;
  PlayerId: string;
  PlayerYRot: number;
  PosX: number;
  PosY: number;
  PosZ: number;
  SchemaCommitHash: string;
  Sender: string;
  Seq: number;
  ServerId: string;
  Treatments: string;
  UserId: string;
  WorldFeature: number;
  WorldSessionId: string;
  editionType: string;
  isTrial: number;
  locale: string;
  vrMode: boolean;
}
