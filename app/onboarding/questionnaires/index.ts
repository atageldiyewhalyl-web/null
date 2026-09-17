import type { Questionnaire } from "../types";
import { bergstoneKeramiksan } from "./bergstone-keramiksan";

/** Client onboarding flows, keyed by the URL slug under /onboarding/:slug. */
export const questionnaires: Record<string, Questionnaire> = {
  [bergstoneKeramiksan.client.slug]: bergstoneKeramiksan,
};
