import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export interface IconSpec {
  name: string;
  family?: 'ionicons' | 'mci';
}

interface Props extends IconSpec {
  size?: number;
  color?: string;
}

export function Icon({ name, family = 'ionicons', size = 20, color }: Props) {
  if (family === 'mci') {
    return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
  }
  return <Ionicons name={name as any} size={size} color={color} />;
}
