import { Button, Divider, Stack, Typography } from "@mui/material";
import { useCommandHandler } from "./CommandHandlerContext";
import useFlowingBalance from "./useFlowingBalance";
import { parseEther } from "viem";
import { mapTimePeriodToSeconds } from "superfluid-checkout-core";
import { SendStreamCommand } from "./commands";
import { useMemo } from "react";
import { useWidget } from "./WidgetContext";
import FlowingBalance from "./FlowingBalance";

export function CheckoutSummary() {
  const { getSuperToken } = useWidget();
  const { commands } = useCommandHandler();

  const sendStreamCommand = commands.find(
    (x) => x.type === "Send Stream"
  )! as SendStreamCommand; // TODO: Do this more type-safe.

  const flowRate =
    parseEther(sendStreamCommand.flowRate.amountEther) /
    BigInt(mapTimePeriodToSeconds(sendStreamCommand.flowRate.period));

  // TODO: hack
  // TODO: do the flowing balance animation with a speed-up
  const startingBalance = 0n;
  const startingBalanceDate = useMemo(() => new Date(), []);

  const superToken = useMemo(
    () => getSuperToken(sendStreamCommand.superTokenAddress),
    [sendStreamCommand.superTokenAddress]
  );

  // TODO: add merchant link

  return (
    <Stack sx={{ m: 3 }}>
      <Stack direction="column" alignItems="center">
        <Typography variant="h5" component="span">
          Success!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your purchase was confirmed.
        </Typography>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Stack direction="column" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          You've streamed
        </Typography>
        <Typography variant="h5" component="span">
          <FlowingBalance
            flowRate={flowRate}
            startingBalance={startingBalance}
            startingBalanceDate={startingBalanceDate}
          />{" "}
          {superToken.symbol}
        </Typography>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Button fullWidth variant="outlined">
        Go to Superfluid Dashboard
      </Button>
    </Stack>
  );
}
