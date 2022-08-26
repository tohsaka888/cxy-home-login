declare namespace API {
  type RegisterProps = {
    username: string;
    password: string;
    email: string;
  }

  type LoginProps = {
    username: string;
    password: string;
    email: string;
  }

  type AuthCodeProps = {
    code: string;
    email: string;
  }
}