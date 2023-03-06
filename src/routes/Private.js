import { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../contexts/auth';

export default function Private({ childreen }) {
  return childreen;
}
