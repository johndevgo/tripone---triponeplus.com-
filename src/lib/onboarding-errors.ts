type DatabaseError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

export function publicGenerationError(error: DatabaseError, reference: string) {
  if (error.code === "23505") return "That website address is already in use.";
  return `We couldn't build your website. Your details are saved, so you can try again. Reference: ${reference}`;
}
