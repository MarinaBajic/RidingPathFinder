import { PathSegment } from "./PathSegment";

export interface Path {
    id: number;
    name: string;
    description: string;
    segments: PathSegment[];
}