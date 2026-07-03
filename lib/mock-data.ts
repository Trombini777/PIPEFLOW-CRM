export type Workspace = {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro";
};

export const mockWorkspaces: Workspace[] = [
  { id: "1", name: "Acme Inc.", slug: "acme", plan: "pro" },
  { id: "2", name: "Estúdio Nova", slug: "estudio-nova", plan: "free" },
  { id: "3", name: "TechFlow Soluções", slug: "techflow", plan: "free" },
];

export type MockUser = {
  name: string;
  email: string;
  initials: string;
};

export const mockUser: MockUser = {
  name: "Eliezer Trombini",
  email: "eliezertrombini@gmail.com",
  initials: "ET",
};
