import React, { useEffect, useState } from 'react'

const Image = ({ fileName, body, type, mimeType }) => {
    // const newtype = new Buffer(type)
    // const buff = Buffer.from(type, "utf-8");

    const [imageSrc, setImageSrc] = useState("");
    const blob = new Blob([body], { type })
    useEffect(() => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            console.log("res : ", reader.result.split(',')[1]);
            setImageSrc(reader.result)
        }
        console.log("mimeType : ", mimeType)

    }, [body, type, mimeType])
    return (
        <>
            {mimeType == "application/pdf" && <div>PDF : {fileName}</div>}
            {(mimeType == "image/png") ? <div>{fileName}</div> : <img style={{ width: 150, height: "auto" }} src={imageSrc} alt={fileName + "-pui-pui"} />
            }
            {mimeType}
            {/* <div>{body}</div> */}
            {/* <div>{type}</div> */}
        </>
    )
}

export default Image