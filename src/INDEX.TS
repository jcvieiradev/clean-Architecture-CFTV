//1. Interface de autenticação
//Define o contrato: qualquer autenticador precisa ter um método authenticate().

interface IAuthenticator {
    authenticate(username: string, password: string): boolean;
  }


  //2. Implementação concreta
  //Esta é a implementação concreta do serviço de autenticação.

  class Authenticator implements IAuthenticator {
    authenticate(username: string, password: string): boolean {
      // lógica real de autenticação
      return username === "admin" && password === "123";
    }
  }

  //3. Interface de repositório de usuário
  //
  interface IUserRepository {
    saveAuthenticatedUser(username: string): void;
  }
  
  //4. Implementação concreta do repositório
  class UserRepository implements IUserRepository {
    saveAuthenticatedUser(username: string): void {
      // salvar no banco, redis, logs, etc.
      console.log("Usuário salvo:", username);
    }
  }
  
  // --- USE CASE ---------------------
  class LoginUseCase {
    constructor(
      private authenticator: IAuthenticator,
      private userRepository: IUserRepository
    ) {}
  
    execute(username: string, password: string) {
      const ok = this.authenticator.authenticate(username, password);
  
      if (!ok) {
        throw new Error("Credenciais inválidas");
      }
  
      this.userRepository.saveAuthenticatedUser(username);
  
      return { success: true };
    }
  }
  
  // --- DEPENDENCY INJECTION ----------
  
  const authenticator = new Authenticator();

  const user = "pass"
  const pass = "123456"
  const teste = authenticator.authenticate(user, pass)

  const userRepository = new UserRepository();
  
  const loginUseCase = new LoginUseCase(authenticator, userRepository);
  
  // Exemplo de uso:
  loginUseCase.execute("admin", "123");
  