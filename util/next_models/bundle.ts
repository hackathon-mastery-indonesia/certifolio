import { Certificate } from "./certificate"

export type Bundle = {
    name: string,
    key: string,
    certificateList : Certificate[]
}