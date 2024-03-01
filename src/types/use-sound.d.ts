/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'use-sound' {
    export default function useSound(
      path: string,
      options?: any
    ): [() => void, { sound: any, stop: () => void }];
}