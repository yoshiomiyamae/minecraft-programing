import {
  Target, TargetSelector, Item, Block, MaskMode, CloneMode, Difficulty,
  Effect, Enchant, Commands, OldBlockHandling, GameMode, Rule, ListDetails,
  Feature, MixerControl, MobEvent, Particle, ParticleMode, ReplaceItemType,
  CustomSlotType, SlotType, EntityType, TagType, Rotation, TimeCommand, Time, TitleCommand, WeatherType, Direction, TurnDirection,
} from "./type";
import { uuidGenerator } from "./common";
import { Position } from './type';

export interface Command {
  body: CommandBody;
  header: CommandHeader;
}

interface CommandBody {
  origin: CommandBodyOrigin;
  commandLine: string;
  version: number;
}

interface CommandHeader {
  requestId: string;
  messagePurpose: string;
  version: number;
  messageType: string;
}

interface CommandBodyOrigin {
  type: string;
}

const defaultHeader = (uuid?: string) => <CommandHeader>{
  requestId: uuid || uuidGenerator(),
  messagePurpose: 'commandRequest',
  version: 1,
  messageType: 'commandRequest'
};

const commandBuilder = (command: string, uuid?: string) => JSON.stringify(<Command>{
  body: {
    origin: {
      type: 'player',
    },
    commandLine: command,
    version: 1,
  },
  header: defaultHeader(uuid),
});

export const alwaysDay = (lock?: boolean) =>
  commandBuilder(`alwaysday ${lock || ''}`);
export const clear = (player?: Target | TargetSelector, itemName?: Block | Item, dataValue?: number, maxCount?: number) =>
  commandBuilder(`clear ${player || ''} ${itemName || ''} ${dataValue === undefined ? '' : dataValue} ${maxCount === undefined ? '' : maxCount}`);
export const clone = (begin: Position, end: Position, destination: Position, maskMode?: MaskMode, cloneMode?: CloneMode, tileName?: Block, dataValue?: number) =>
  commandBuilder(`clone ${begin} ${end} ${destination} ${maskMode || ''} ${cloneMode || ''} ${tileName || ''} ${dataValue === undefined ? '' : dataValue}`);
export const connect = (serverUri: string) =>
  wsServer(serverUri)
export const dayLock = (lock?: boolean) =>
  alwaysDay(lock);
export const deOp = (player: Target | TargetSelector) =>
  commandBuilder(`deop ${player}`);
export const difficulty = (difficulty: Difficulty) =>
  commandBuilder(`difficulty ${difficulty}`);
export const effect = (player: Target | TargetSelector, effect: Effect, seconds?: number, amplifier?: number, hideParticles?: boolean) =>
  commandBuilder(`effect ${player} ${effect} ${seconds === undefined ? '' : seconds} ${amplifier === undefined ? '' : amplifier} ${hideParticles || ''}`);
export const enchant = (player: Target | TargetSelector, enchantment: Enchant, level?: number) =>
  commandBuilder(`enchant ${player} ${enchantment} ${level === undefined ? '' : level}`);
// executeは後で実装する
export const fill = (from: Position, to: Position, tileName: Block | string, dataValue?: number, oldBlockHandling?: OldBlockHandling, replaceTileName?: Block | string, replaceDataValue?: number) =>
  commandBuilder(`fill ${from} ${to} ${tileName} ${dataValue === undefined ? '' : dataValue} ${oldBlockHandling || ''} ${replaceTileName || ''} ${replaceDataValue || ''}`);
// functionは後で実装する
export const gameMode = (gameMode: GameMode, player?: Target | TargetSelector) =>
  commandBuilder(`gamemode ${gameMode} ${player || ''}`);
export const gameRule = (rule: Rule | string, value?: boolean | number) =>
  commandBuilder(`gamerule ${rule} ${value || ''}`);
export const give = (player: Target | TargetSelector, itemName: Block | Item, amount?: number, dataValue?: number) =>
  commandBuilder(`give ${player} ${itemName} ${amount === undefined ? '' : amount} ${dataValue === undefined ? '' : dataValue}`);
export const help = (command?: Commands, page?: number) =>
  commandBuilder(`help ${command || ''} ${page === undefined ? '' : page}`);
export const kill = (target?: Target | TargetSelector) =>
  commandBuilder(`kill ${target || ''}`);
export const list = (details?: ListDetails) =>
  commandBuilder(`list ${details || ''}`);
export const locate = (feature: Feature) =>
  commandBuilder(`locate ${feature}`);
export const me = (message: string) =>
  commandBuilder(`me ${message}`);
export const mixer = (mixerControl: MixerControl, sceneNameOrVersionID: string | number, commonCode?: string) =>
  commandBuilder(`mixer ${mixerControl} ${sceneNameOrVersionID} ${commonCode || ''}`);
export const mobEvent = (eventName: MobEvent, on?: boolean) =>
  commandBuilder(`mobevent ${eventName} ${on || ''}`);
export const msg = (target: Target | TargetSelector, message: string) =>
  tell(target, message);
export const op = (player: Target | TargetSelector) =>
  commandBuilder(`op ${player}`);
export const particle = (particle: Particle, position: Position, length: Position, speed: number, count?: number, mode?: ParticleMode, player?: Target | TargetSelector) =>
  commandBuilder(`particle ${particle} ${position} ${length} ${speed} ${count === undefined ? '' : count} ${mode || ''} ${player || ''}`);
export const playSound = (sound: string, player?: Target | TargetSelector, position?: Position, volume?: number, pitch?: number, minimumVolume?: number) =>
  commandBuilder(`playsound ${sound} ${player || ''} ${player || ''} ${position || ''} ${volume === undefined ? '' : volume} ${pitch === undefined ? '' : pitch} ${minimumVolume === undefined ? '' : minimumVolume}`);
export const reload = () =>
  commandBuilder(`reload`);
export const replaceItem = (replaceItemType: ReplaceItemType, positionOrTarget: Position | Target | TargetSelector, slotType: SlotType | CustomSlotType, slotId: number, itemName: Block | Item, amount?: number, dataValue?: number) =>
  commandBuilder(`replaceitem ${replaceItemType} ${positionOrTarget} ${slotType} ${slotId} ${itemName} ${amount || ''} ${dataValue === undefined ? '' : dataValue}`);
export const say = (message: string) =>
  commandBuilder(`say ${message}`);
// scoreboardは後で実装する
export const setBlock = (position: Position, tileName: Block | string, tileData?: number, oldBlockHandling?: OldBlockHandling) =>
  commandBuilder(`setblock ${position} ${tileName} ${tileData === undefined ? '' : tileData} ${oldBlockHandling || ''}`);
export const setMaxPlayers = (maxPlayers: number) =>
  commandBuilder(`setmaxplayers ${maxPlayers}`);
export const setWorldSpawn = (spawnPoint: Position) =>
  commandBuilder(`setworldspawn ${spawnPoint}`);
export const spawnPoint = (player?: Target | TargetSelector, spawnPoint?: Position) =>
  commandBuilder(`spawnpoint ${player || ''} ${spawnPoint || ''}`);
export const spreadPlayers = (x: number | string, z: number | string, spreadDistance: number, maxRange: number, victim: Target | TargetSelector) =>
  commandBuilder(`spreadplayers ${x} ${z} ${spreadDistance} ${maxRange} ${victim}`);
export const stopSound = (player: Target | TargetSelector, sound?: string) =>
  commandBuilder(`stopsound ${player} ${sound || ''}`);
export const summon = (entityType: EntityType | string, spawnPos?: Position) =>
  commandBuilder(`summon ${entityType} ${spawnPos || ''}`);
export const tag = (targets: Target | TargetSelector, tagType: TagType, name?: string) =>
  commandBuilder(`tag ${targets} ${tagType} ${name || ''}`);
export const teleport = (destination: Target | TargetSelector | Position, yRot?: Rotation, xRot?: Rotation) =>
  commandBuilder(`teleport ${destination} ${yRot || ''} ${xRot || ''}`);
export const tell = (target: Target | TargetSelector, message: string) =>
  commandBuilder(`tell ${target} ${message}`);
export const tellRaw = (player: Target | TargetSelector, rawJsonMessage: {} | string) =>
  commandBuilder(`tellraw ${player} ${typeof rawJsonMessage === 'string' ? rawJsonMessage : JSON.stringify(rawJsonMessage)}`);
export const testFor = (victim: Target | TargetSelector) =>
  commandBuilder(`testfor ${victim}`);
export const testForBlock = (position: Position, tileName: Block | string, dataValue?: number) =>
  commandBuilder(`testforblock ${position} ${tileName} ${dataValue === undefined ? '' : dataValue}`);
export const testForBlocks = (begin: Position, end: Position, destination: Position, maskMode?: MaskMode) =>
  commandBuilder(`testforblocks ${begin} ${end} ${destination} ${maskMode || ''}`);
// tickingareaは後で実装する
export const time = (timeCommand: TimeCommand, amountOrTime: number | Time) =>
  commandBuilder(`time ${timeCommand} ${amountOrTime}`);
export const title = (player: Target | TargetSelector, titleCommand: TitleCommand, titleText: string) =>
  commandBuilder(`title ${player} ${titleCommand} ${titleText}`);
export const toggleDownFall = () =>
  commandBuilder(`toggledownfall`);
export const tp = (destination: Target | TargetSelector | Position, yRot?: Rotation, xRot?: Rotation) =>
  commandBuilder(`tp ${destination} ${yRot || ''} ${xRot || ''}`);
export const transferServer = (server: string, port: number) =>
  commandBuilder(`transferserver ${server} ${port}`);
export const w = (target: Target | TargetSelector, message: string) =>
  tell(target, message);
export const weather = (weatherType: WeatherType, duration?: number) =>
  commandBuilder(`weather ${weatherType} ${duration === undefined ? '' : duration}`);
export const wsServer = (serverUri: string) =>
  commandBuilder(`wsserver ${serverUri}`);
export const xp = (amount: number, player?: Target | TargetSelector) =>
  commandBuilder(`xp ${amount} ${player || ''}`);

// WebSocket限定関数
export const agentMove = (direction: Direction | string) =>
  commandBuilder(`agent move ${direction}`);
export const agentTurn = (turnDirection: TurnDirection) =>
  commandBuilder(`agent turn ${turnDirection}`);
export const agentAttack = (direction: Direction) =>
  commandBuilder(`agent attack ${direction}`);
export const agentDestroy = (direction: Direction) =>
  commandBuilder(`agent destroy ${direction}`);
export const agentDrop = (slotNum: number, quantity: number, direction: Direction) =>
  commandBuilder(`agent drop ${slotNum} ${quantity} ${direction}`);
export const agentDropAll = (direction: Direction) =>
  commandBuilder(`agent dropall ${direction}`);
export const agentInspect = (direction: Direction) =>
  commandBuilder(`agent inspect ${direction}`);
export const agentInspectData = (direction: Direction) =>
  commandBuilder(`agent inspectdata ${direction}`);
export const agentDetect = (direction: Direction) =>
  commandBuilder(`agent detect ${direction}`);
export const agentDetectRedStone = (direction: Direction) =>
  commandBuilder(`agent detectredstone ${direction}`);
export const agentTransfer = (srcSlotNum: number, quantity: number, dstSlotNum: number) =>
  commandBuilder(`agent drop ${srcSlotNum} ${quantity} ${dstSlotNum}`);
export const agentCreate = (uuid: string) =>
  commandBuilder('agent create', uuid);
export const agentTp = (destination?: Target | TargetSelector | Position) =>
  commandBuilder(`agent tp ${destination || ''}`);
export const agentCollect = (item: Block | Item) =>
  commandBuilder(`agent collect ${item}`);
export const agentTill = (direction: Direction) =>
  commandBuilder(`agent till ${direction}`);
export const agentPlace = (slotNum: number, direction: Direction) =>
  commandBuilder(`agent place ${slotNum} ${direction}`);
export const agentGetItemCount = (slotNum: number) =>
  commandBuilder(`agent getitemcount ${slotNum}`);
export const agentGetItemSpace = (slotNum: number) =>
  commandBuilder(`agent getitemspace ${slotNum}`);
export const agentGetItemDetail = (slotNum: number) =>
  commandBuilder(`agent getitemdetail ${slotNum}`);
export const closeWebSocket = () =>
  commandBuilder('closewebsocket');
export const enableEncryption = (key: string, iv: string) =>
  commandBuilder(`enableencryption "${key}" "${iv}"`);
export const listD = () =>
  commandBuilder('listd');
export const getEduClientInfo = () =>
  commandBuilder('geteduclientinfo');
export const queryTarget = (target: Target | TargetSelector, uuid: string) =>
  commandBuilder(`querytarget ${target}`, uuid);

// 独自関数
export const levelUp = (amount: number, player?: Target | TargetSelector) =>
  commandBuilder(`xp ${amount}L ${player || ''}`);
export const teleportVictim = (victim: Target | TargetSelector, destination: Target | TargetSelector | Position, yRot?: Rotation, xRot?: Rotation) =>
  commandBuilder(`teleport ${victim} ${destination} ${yRot || ''} ${xRot || ''}`);
export const clearTitle = (player: Target | TargetSelector) =>
  commandBuilder(`title ${player} clear`);
export const resetTitle = (player: Target | TargetSelector) =>
  commandBuilder(`title ${player} reset`);
export const setTitleTime = (player: Target | TargetSelector, fadeIn: number, stay: number, fadeOut: number) =>
  commandBuilder(`title ${player} times ${fadeIn} ${stay} ${fadeOut}`);
export const tpVictim = (victim: Target | TargetSelector, destination: Target | TargetSelector | Position, yRot?: Rotation, xRot?: Rotation) =>
  commandBuilder(`tp ${victim} ${destination} ${yRot || ''} ${xRot || ''}`);

export default {
  clear,
  clone,
  connect,
  deOp,
  difficulty,
  effect,
  enchant,
  fill,
  gameMode,
  gameRule,
  give,
  help,
  kill,
  list,
  locate,
  me,
  xp,
  mixer,
  mobEvent,
  msg,
  op,
  particle,
  playSound,
  reload,
  replaceItem,
  say,
  setBlock,
  setMaxPlayers,
  setWorldSpawn,
  spawnPoint,
  spreadPlayers,
  stopSound,
  summon,
  tag,
  teleport,
  tell,
  tellRaw,
  testFor,
  testForBlock,
  testForBlocks,
  time,
  title,
  toggleDownFall,
  tp,
  transferServer,
  w,
  weather,
  wsServer,
  levelUp,
  teleportVictim,
  clearTitle,
  resetTitle,
  setTitleTime,
  tpVictim,

  agentMove,
  agentTurn,
  agentAttack,
  agentDestroy,
  agentDrop,
  agentDropAll,
  agentInspect,
  agentInspectData,
  agentDetect,
  agentDetectRedStone,
  agentTransfer,
  agentCreate,
  agentTp,
  agentCollect,
  agentTill,
  agentPlace,
  agentGetItemCount,
  agentGetItemSpace,
  agentGetItemDetail,
  closeWebSocket,
  enableEncryption,
  listD,
  getEduClientInfo,
  queryTarget,
}