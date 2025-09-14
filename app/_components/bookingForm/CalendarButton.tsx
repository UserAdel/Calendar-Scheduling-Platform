import { Button } from "@/components/ui/button";
import { AriaButtonProps, useButton } from "@react-aria/button";
import { CalendarState } from "react-stately";
import { mergeProps, useFocusRing } from "react-aria";
import { useRef, type ReactNode } from "react";
export function CalendarButton({
  props,
  children,
}: {
  props: AriaButtonProps<"button"> & {
    state?: CalendarState;
    side?: "left" | "right";
  };
  children?: ReactNode;
}) {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);
  const { focusProps } = useFocusRing();
  return (
    <Button
      variant="outline"
      size="icon"
      ref={ref}
      disabled={props.isDisabled}
      {...mergeProps(buttonProps, focusProps)}
    >
      {children ?? props.children}
    </Button>
  );
}
