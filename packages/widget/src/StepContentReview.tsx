import {
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  StepContent,
  Typography,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { ValidFormValues } from "./formValues";
import { useCommandHandler } from "./CommandHandlerContext";
import { useChainId, useSwitchNetwork } from "wagmi";
import { useMemo } from "react";
import { StepperContinueButton } from "./StepperContinueButton";

export default function StepContentReview() {
  const {
    formState: { isValid, isValidating },
    watch,
  } = useFormContext<ValidFormValues>();
  const { commands: commandAggregates } = useCommandHandler();

  const commands = useMemo(
    () =>
      commandAggregates.map((x) => {
        const { contractWrites, ...command } = x;
        return command;
      }),
    [commandAggregates]
  );

  const expectedChainId = watch("network.id");
  const chainId = useChainId();

  const { switchNetwork } = useSwitchNetwork();
  const needsToSwitchNetwork = expectedChainId !== chainId;

  return (
    <StepContent TransitionProps={{ unmountOnExit: true }}>
      <Stack>
        <Stack direction="column" spacing={3}>
          <List sx={{ ml: 1.5 }}>
            {commands.map((cmd) => {
              const { type: title, ...rest } = cmd;
              return (
                <ListItem key={title}>
                  <ListItemText
                    primary={title}
                    secondary={
                      <Typography component="pre" variant="body2">
                        {JSON.stringify(rest, null, 2)}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Stack>
        {needsToSwitchNetwork ? (
          <Button
            size="large"
            variant="contained"
            fullWidth
            onClick={() => switchNetwork?.(expectedChainId)}
          >
            Switch Network
          </Button>
        ) : (
          <StepperContinueButton disabled={!isValid || isValidating}>Subscribe</StepperContinueButton>
          // <Button
          //   disabled={!isValid || isValidating}
          //   variant="contained"
          //   fullWidth
          //   onClick={() => {
          //     handle();
          //   }}
          // >
          //   Subscribe
          // </Button>
        )}
      </Stack>
    </StepContent>
  );
}
