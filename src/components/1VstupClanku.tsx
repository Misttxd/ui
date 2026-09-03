import { useState } from "react";
//TextArea na clanek, to je celkem goofy, takže ten inputby chtěl pořešit nějak jinak, ale pro začátek to můžeme nechat takhle
//přepínač rezimu (agentic rag, clean rag)
//button

import { Textarea } from "@mantine/core";

function TextovaArea()
{
    const [text, setText] = useState("")
    return (
        <div>
        <Textarea value={text} onChange={(e) =>setText(e.target.value)}>

        </Textarea>

        <label>{text}</label>
        </div>
    )
}



export default function VstupClanku(){
    return (
        <TextovaArea></TextovaArea>
    )
}