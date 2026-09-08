import { useState } from "react";

import { SegmentedControl, Textarea, Button, Stack } from "@mantine/core";

//TextArea na clanek, to je celkem goofy, takže ten input by chtěl pořešit nějak
//jinak, ale pro začátek to můžeme nechat takhle
//přepínač rezimu (agentic rag, clean rag)
//button

export type Rezim = 'prosty' | 'agentni'

type VstupClankuProps = {
  onOdeslat: (text: string, rezim: Rezim) => void
  nacita: boolean
}

export default function VstupClanku({ onOdeslat, nacita }: VstupClankuProps) {
  const [text, setText] = useState("")
  const [rezim, setRezim] = useState<Rezim>('prosty')

  return (
    <Stack>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        label="Text článku"
        placeholder="Vlož článek…"
        autosize
        minRows={6}
      />

      <SegmentedControl
        value={rezim}
        // SegmentedControl vrací obyčejný string, proto to `as Rezim`
        onChange={(hodnota) => setRezim(hodnota as Rezim)}
        disabled={nacita}
        data={[
          { label: 'Klasický RAG', value: 'prosty' },
          { label: 'Agentní RAG', value: 'agentni' },
        ]}
      />

      <Button
        onClick={() => onOdeslat(text, rezim)}
        disabled={text === ''}
        loading={nacita}
      >
        Předpovědět
      </Button>
    </Stack>
  )
}
