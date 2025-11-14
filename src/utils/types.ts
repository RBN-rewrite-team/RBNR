export type ChooseTypes<A extends object, C> = keyof {
	[key in keyof A as A[key] extends C ? key : never]: A[key];
};
