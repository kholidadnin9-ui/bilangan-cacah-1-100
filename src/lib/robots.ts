export interface RobotOption {
  id: string;
  name: string;
  src: string;
  tint: string;
  desc: string;
}

export const ROBOTS: RobotOption[] = [
  {
    id: "biru",
    name: "Biru Petir",
    src: "images/robot.png",
    tint: "#2ee6ff",
    desc: "Cepat & teliti",
  },
  {
    id: "merah",
    name: "Merah Perkasa",
    src: "images/robot-merah.png",
    tint: "#ff5252",
    desc: "Berani & kuat",
  },
  {
    id: "kuning",
    name: "Kuning Emas",
    src: "images/robot-kuning.png",
    tint: "#ffd21f",
    desc: "Cerdas & sabar",
  },
  {
    id: "pink",
    name: "Pink Ceria",
    src: "images/robot-pink.png",
    tint: "#ff6ec7",
    desc: "Ramah & gembira",
  },
];

export function robotSrc(id?: string): string {
  return ROBOTS.find((r) => r.id === id)?.src ?? ROBOTS[0].src;
}

export function robotTint(id?: string): string {
  return ROBOTS.find((r) => r.id === id)?.tint ?? ROBOTS[0].tint;
}

export function robotName(id?: string): string {
  return ROBOTS.find((r) => r.id === id)?.name ?? ROBOTS[0].name;
}
