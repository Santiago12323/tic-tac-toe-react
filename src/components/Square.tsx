import { Button } from "@nextui-org/react";

export default function Square({ value, onClick }) {
  return (
    <Button
      shadow
      color="primary"
      auto
      css={{ w: 80, h: 80, fontSize: "$2xl" }}
      onPress={onClick}
    >
      {value}
    </Button>
  );
}
