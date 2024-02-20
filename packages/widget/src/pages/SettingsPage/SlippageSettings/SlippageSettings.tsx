import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Typography } from '@mui/material';
import type { ChangeEventHandler, FocusEventHandler } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingMonitor, useToken } from '../../../hooks';
import {
  defaultSlippage,
  useFieldValues,
  useSettings,
  useSettingsStore,
} from '../../../stores';
import { formatSlippage, formatTokenPrice } from '../../../utils';
import {
  SettingsFieldSet,
  SlippageCustomInput,
  SlippageDefaultButton,
  SlippageLimitsWarningContainer,
} from './SlippageSettings.style';
import axios from 'axios';

export const SlippageSettings: React.FC = () => {
  const { t } = useTranslation();
  const { isSlippageOutsideRecommendedLimits, isSlippageChanged } =
    useSettingMonitor();
  const { slippage } = useSettings(['slippage']);
  const setValue = useSettingsStore((state) => state.setValue);
  const defaultValue = useRef(slippage);
  const [focused, setFocused] = useState<'input' | 'button'>();
  const [fromChain, fromToken, fromAmount] = useFieldValues(
    'fromChain',
    'fromToken',
    'fromAmount',
  );
  const { token } = useToken(fromChain, fromToken);
  const [inputValue, setInputValue] = useState('');

  const handleInputUpdate: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setInputValue(value);
    setValue(
      'slippage',
      formatSlippage(value || defaultSlippage, defaultValue.current, true),
    );
  };

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    if (value) {
      setInputValue(value);
      setValue(
        'slippage',
        formatSlippage(value || defaultSlippage, defaultValue.current),
      );
    } else {
      setInputValue('');
      setFocused('button');
      setValue(
        'slippage',
        formatSlippage(defaultSlippage, defaultValue.current),
      );
    }
  };

  const handleAutoSlippage = async () => {
    setInputValue('');
    const fromAmountTokenPrice = formatTokenPrice(fromAmount, token?.priceUSD);

    const params = {
      address: fromToken,
      blockchain: fromChain?.toString(),
      amount: fromAmountTokenPrice,
    };

    const res = await axios.get(
      'https://api.getnimbus.io/token/auto-slippage',
      {
        params,
      },
    );

    setValue(
      'slippage',
      formatSlippage(res?.data?.data.toString(), defaultValue.current),
    );
  };

  return (
    <>
      <SettingsFieldSet>
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          <SlippageDefaultButton
            selected={'0.3' === slippage && focused !== 'input'}
            onFocus={() => {
              setFocused('button');
            }}
            onClick={() => {
              setInputValue('');
              setValue('slippage', formatSlippage('0.3', defaultValue.current));
            }}
            disableRipple
          >
            0.3
          </SlippageDefaultButton>

          <SlippageDefaultButton
            selected={defaultSlippage === slippage && focused !== 'input'}
            onFocus={() => {
              setFocused('button');
            }}
            onClick={() => {
              setInputValue('');
              setValue(
                'slippage',
                formatSlippage(defaultSlippage, defaultValue.current),
              );
            }}
            disableRipple
          >
            {defaultSlippage}
          </SlippageDefaultButton>

          <SlippageDefaultButton
            selected={'1' === slippage && focused !== 'input'}
            onFocus={() => {
              setFocused('button');
            }}
            onClick={() => {
              setInputValue('');
              setValue('slippage', formatSlippage('1', defaultValue.current));
            }}
            disableRipple
          >
            1
          </SlippageDefaultButton>

          <SlippageDefaultButton
            selected={
              slippage !== defaultSlippage &&
              slippage !== '1' &&
              slippage !== '0.3' &&
              focused !== 'input'
            }
            onFocus={() => {
              setFocused('button');
            }}
            onClick={handleAutoSlippage}
            disableRipple
          >
            Auto
          </SlippageDefaultButton>
        </div>

        <SlippageCustomInput
          selected={focused !== 'button' && Boolean(inputValue)}
          placeholder={focused === 'input' ? '' : t('settings.custom')}
          inputProps={{
            inputMode: 'decimal',
          }}
          onChange={handleInputUpdate}
          onFocus={() => {
            setFocused('input');
          }}
          onBlur={handleInputBlur}
          value={inputValue}
          autoComplete="off"
        />
      </SettingsFieldSet>

      {isSlippageOutsideRecommendedLimits && (
        <SlippageLimitsWarningContainer>
          <WarningRoundedIcon color="warning" />
          <Typography fontSize={13} fontWeight={400}>
            {t('warning.message.slippageOutsideRecommendedLimits')}
          </Typography>
        </SlippageLimitsWarningContainer>
      )}
    </>
  );
};
