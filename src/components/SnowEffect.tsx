'use client';

import { useSnowEffect } from '@/hooks/useSnowEffect';

interface SnowEffectProps {
    enabled?: boolean;
}

export const SnowEffect: React.FC<SnowEffectProps> = ({ enabled = true }) => {
    useSnowEffect(enabled);
    return null;
};
