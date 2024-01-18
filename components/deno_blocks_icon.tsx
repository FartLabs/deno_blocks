export interface DenoBlocksIconProps {
  size?: string;
}

export default function DenoBlocksIcon(props: DenoBlocksIconProps) {
  return (
    <div
      class="deno-blocks-icon"
      role="img"
      aria-label="Deno Blocks"
      title="Deno Blocks"
      style={props.size ? { width: props.size, height: props.size } : undefined}
    />
  );
}
