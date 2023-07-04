import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DraftFormValues, PaymentOptionWithTokenInfo } from "./formValues";
import { useWidget } from "./WidgetContext";
import { TokenAvatar } from "./TokenAvatar";
import { flowRatesEqual } from "./helpers/flowRateHelpers";

export default function TokenAutocomplete() {
  const { paymentOptionWithTokenInfoList } = useWidget();
  const { control: c, watch } = useFormContext<DraftFormValues>();
  const [network] = watch(["network"]);

  const autocompleteOptions = useMemo<
    ReadonlyArray<PaymentOptionWithTokenInfo>
  >(
    () =>
      network
        ? paymentOptionWithTokenInfoList.filter(
            ({ paymentOption }) => paymentOption.chainId === network.id
          )
        : [],
    [network, paymentOptionWithTokenInfoList]
  );

  return (
    <Controller
      control={c}
      name="paymentOptionWithTokenInfo"
      render={({ field: { value, onChange, onBlur } }) => (
        <Autocomplete
          disabled={network === null}
          value={value}
          disableClearable={!!value}
          isOptionEqualToValue={(option, value) => {
            const {
              paymentOption: {
                superToken: { address: optionTokenAddress },
                flowRate: optionFlowRate,
              },
            } = option;
            const {
              paymentOption: {
                superToken: { address: valueTokenAddress },
                flowRate: valueFlowRate,
              },
            } = value;

            if (optionTokenAddress === valueTokenAddress) {
              if (flowRatesEqual(optionFlowRate, valueFlowRate)) {
                return true;
              }
            }

            return false;
          }}
          options={autocompleteOptions}
          autoHighlight
          getOptionLabel={(option) => option.superToken.symbol}
          renderOption={(props, option) => (
            <Stack
              {...props}
              component="li"
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <TokenAvatar tokenInfo={option.superToken} />
              <Typography>
                {option.paymentOption.flowRate
                  ? `${option.paymentOption.flowRate.amountEther} ${option.superToken.symbol}/${option.paymentOption.flowRate.period}`
                  : `${option.superToken.symbol} - Custom amount`}
              </Typography>
            </Stack>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                sx: { cursor: "pointer" },
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: value ? (
                  <TokenAvatar tokenInfo={value.superToken} sx={{ ml: 1 }} />
                ) : null,
              }}
              size="small"
              placeholder="Token"
            />
          )}
          componentsProps={{
            popper: {
              placement: "bottom-end",
              sx: {
                minWidth: "min(100%, 300px)",
                mt: "2px !important",
              },
              disablePortal: true,
            },
          }}
          // Using structuredClone to lose reference to the original option.
          // If user selects custom amount option and modifies the values then we won't mutate the original option
          onChange={(_event, newValue) => onChange(structuredClone(newValue))}
          onBlur={onBlur}
        />
      )}
    />
  );
}
