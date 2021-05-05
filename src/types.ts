export interface ReceivedJson {
  visit: VisitedField[];
  errCode: number;
}

export interface VisitedField {
  url: string;
  title: string;
}

export interface RequestParameters {
  nicName: string;
  loginKey: number;
  v: string;
  userNo: number;
  chkSum: number;
}

export interface SecretValues {
  nicName: string;
  loginKey: number;
  userNo: number;
  chkSum: number;
}
