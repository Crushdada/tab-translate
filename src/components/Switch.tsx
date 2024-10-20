import { Switch } from "@/lib/shardcn-coms/Switch"
import { useState } from 'react'

export default function SwitchBtn() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch
      checked={enabled}
      onChange={(event) => setEnabled(event.target.checked)}
      className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
    >
    </Switch>
  )
}