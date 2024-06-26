
import { useState } from 'react';
import { StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import {useTranslation} from "react-i18next";

import './index.css';
import {useTheme} from "../../../../hooks/useTheme";


const { Statistic, Divider } = StatisticCard;

// eslint-disable-next-line react/prop-types
const BackupStatistic = ({size, data}) => {
    const { t } = useTranslation()
    const [responsive, setResponsive] = useState(false);
    const {theme, toggleTheme} = useTheme();

    return (
        <>
            <RcResizeObserver key="resize-observer" onResize={(offset) => {
                setResponsive(offset.width < 596);
            }}>
                <StatisticCard.Group
                    className={theme === 'dark' ? 'dark' : ''}
                    direction={responsive ? 'column' : 'row'}>
                    <StatisticCard
                        statistic={{
                            title: t('backup number'),
                            value: size,
                        }} />
                    <Divider type={responsive ? 'horizontal' : 'vertical'} />
                    <StatisticCard statistic={{
                        title: t('backup size'),
                        // value: `${data} GB`,
                        value: data > 1 ? `${data} GB`:`${data * 1024} MB`,
                        // description: <Statistic title="占比" value="38.5%" />,
                    }}
                        // chart={
                        //     <>
                        //         <Progress type="circle" percent={30} strokeColor={20 > 70 ? 'red' : '#5BD171'} status='normal' width={70} strokeLinecap="butt" strokeWidth={8} />
                        //     </>
                        // }
                        // chartPlacement="left"
                    />
                </StatisticCard.Group>
            </RcResizeObserver>
        </>
    )
}

export default BackupStatistic