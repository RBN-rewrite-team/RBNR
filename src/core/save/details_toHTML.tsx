import type { readSaveDetail } from ".";

export function convertDetailsToHTML(det: NonNullable<ReturnType<typeof readSaveDetail>>) {
    return (<div style={{
        border: "1px solid red",
        display: "flex",
    }}>
        {det.chapter}{det.isOrdinal}{det.lastSave}{det.number}{det.version}
    </div>)
}