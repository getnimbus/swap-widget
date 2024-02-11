import PercentIcon from '@mui/icons-material/Percent';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Box, Typography } from '@mui/material';
import type { ChangeEventHandler, FocusEventHandler } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingMonitor } from '../../../hooks';
import {
  defaultSlippage,
  useSettings,
  useSettingsStore,
} from '../../../stores';
import { formatSlippage } from '../../../utils';
import { BadgedValue, SettingCardExpandable } from '../SettingsCard';
import {
  SettingsFieldSet,
  SlippageCustomInput,
  SlippageDefaultButton,
  SlippageLimitsWarningContainer,
} from './SlippageSettings.style';

export const SlippageSettings: React.FC = () => {
  const { t } = useTranslation();
  const { isSlippageOutsideRecommendedLimits, isSlippageChanged } =
    useSettingMonitor();
  const { slippage } = useSettings(['slippage']);
  const setValue = useSettingsStore((state) => state.setValue);
  const defaultValue = useRef(slippage);
  const [focused, setFocused] = useState<'input' | 'button'>();
  const [isAuto, setIsAuto] = useState<boolean>(false);

  const handleDefaultClick = () => {
    setValue('slippage', formatSlippage(defaultSlippage, defaultValue.current));
  };

  const handleInputUpdate: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;

    setIsAuto(false);
    setValue(
      'slippage',
      formatSlippage(value || defaultSlippage, defaultValue.current, true),
    );
  };

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(undefined);

    const { value } = event.target;

    setIsAuto(false);
    setValue(
      'slippage',
      formatSlippage(value || defaultSlippage, defaultValue.current),
    );
  };

  const handleAutoSlippage = () => {
    setIsAuto(true);
  };

  const customInputValue =
    !slippage ||
    slippage === defaultSlippage ||
    slippage === '1' ||
    slippage === '0.3' ||
    !isAuto
      ? ''
      : slippage;

  const badgeColor = isSlippageOutsideRecommendedLimits
    ? 'warning'
    : isSlippageChanged
      ? 'info'
      : undefined;

  return (
    // <SettingCardExpandable
    //   value={
    //     <BadgedValue
    //       badgeColor={badgeColor}
    //       showBadge={!!badgeColor}
    //     >{`${slippage}%`}</BadgedValue>
    //   }
    //   icon={<PercentIcon />}
    //   title={t(`settings.slippage`)}
    // >
    //   <Box mt={1.5}>
    //     <SettingsFieldSet>
    //       <SlippageDefaultButton
    //         selected={defaultSlippage === slippage && focused !== 'input'}
    //         onFocus={() => {
    //           setFocused('button');
    //         }}
    //         onBlur={() => {
    //           setFocused(undefined);
    //         }}
    //         onClick={handleDefaultClick}
    //         disableRipple
    //       >
    //         {defaultSlippage}
    //       </SlippageDefaultButton>
    //       <SlippageCustomInput
    //         selected={defaultSlippage !== slippage && focused !== 'button'}
    //         placeholder={focused === 'input' ? '' : t('settings.custom')}
    //         inputProps={{
    //           inputMode: 'decimal',
    //         }}
    //         onChange={handleInputUpdate}
    //         onFocus={() => {
    //           setFocused('input');
    //         }}
    //         onBlur={handleInputBlur}
    //         value={customInputValue}
    //         autoComplete="off"
    //       />
    //     </SettingsFieldSet>
    //     {isSlippageOutsideRecommendedLimits && (
    //       <SlippageLimitsWarningContainer>
    //         <WarningRoundedIcon color="warning" />
    //         <Typography fontSize={13} fontWeight={400}>
    //           {t('warning.message.slippageOutsideRecommendedLimits')}
    //         </Typography>
    //       </SlippageLimitsWarningContainer>
    //     )}
    //   </Box>
    // </SettingCardExpandable>

    <>
      <SettingsFieldSet>
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          <SlippageDefaultButton
            selected={'0.3' === slippage && !isAuto && focused !== 'input'}
            onFocus={() => {
              setFocused('button');
            }}
            onBlur={() => {
              setFocused(undefined);
            }}
            onClick={() => {
              setIsAuto(false);
              setValue(
                'slippage',
                formatSlippage('0.3', defaultValue.current, true),
              );
            }}
            disableRipple
          >
            0.3
          </SlippageDefaultButton>

          <SlippageDefaultButton
            selected={
              defaultSlippage === slippage && !isAuto && focused !== 'input'
            }
            onFocus={() => {
              setFocused('button');
            }}
            onBlur={() => {
              setFocused(undefined);
            }}
            onClick={() => {
              setIsAuto(false);
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
            selected={'1' === slippage && !isAuto && focused !== 'input'}
            onFocus={() => {
              setFocused('button');
            }}
            onBlur={() => {
              setFocused(undefined);
            }}
            onClick={() => {
              setIsAuto(false);
              setValue(
                'slippage',
                formatSlippage('1', defaultValue.current, true),
              );
            }}
            disableRipple
          >
            1
          </SlippageDefaultButton>

          <SlippageDefaultButton
            selected={isAuto && focused !== 'input'}
            onFocus={() => {
              setFocused('button');
            }}
            onBlur={() => {
              setFocused(undefined);
            }}
            onClick={handleAutoSlippage}
            disableRipple
          >
            Auto
          </SlippageDefaultButton>
        </div>

        <SlippageCustomInput
          selected={
            defaultSlippage !== slippage &&
            '1' !== slippage &&
            '0.3' !== slippage &&
            !isAuto &&
            focused !== 'button'
          }
          placeholder={focused === 'input' ? '' : t('settings.custom')}
          inputProps={{
            inputMode: 'decimal',
          }}
          onChange={handleInputUpdate}
          onFocus={() => {
            setFocused('input');
          }}
          onBlur={handleInputBlur}
          value={customInputValue}
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
