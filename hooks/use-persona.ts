"use client";

import { useCallback, useEffect, useState } from "react";

export type Persona = {
  id: string;
  nickname: string;
  avatarId: number;
};

type PersonaResponse = {
  persona: Persona | null;
  message?: string;
};

async function requestPersona(): Promise<PersonaResponse> {
  let response: Response;
  try {
    response = await fetch("/api/persona/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      cache: "no-store",
    });
  } catch {
    throw new Error("Could not reach PulseBox. Check your connection and try again.");
  }
  const result = (await response.json()) as PersonaResponse;
  if (!response.ok) {
    throw new Error(result.message || "We could not load your persona.");
  }
  return result;
}

export function usePersona() {
  const [persona, setPersonaState] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setPersona = useCallback((nextPersona: Persona | null) => {
    setPersonaState(nextPersona);
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestPersona();
      setPersonaState(result.persona);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not load your persona. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    requestPersona()
      .then((result) => {
        if (active) {
          setPersonaState(result.persona);
          setError(null);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "We could not load your persona. Please try again.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { persona, loading, refresh, setPersona, error };
}
