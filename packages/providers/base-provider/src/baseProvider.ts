import { BaseConfig, BaseController, BaseState } from "@toruslabs/base-controllers";
import { CustomChainConfig, SafeEventEmitterProvider, WalletInitializationError } from "@web3auth/base";

import { IBaseProvider } from "./IBaseProvider";

export interface BaseProviderState extends BaseState {
  chainId: string;
}

export interface BaseProviderConfig extends BaseConfig {
  chainConfig: Partial<CustomChainConfig>;
  networks?: Record<string, CustomChainConfig>;
}

export abstract class BaseProvider<C extends BaseProviderConfig, S extends BaseProviderState, T>
  extends BaseController<C, S>
  implements IBaseProvider<T>
{
  // Assigned in setupProvider
  public _providerProxy: SafeEventEmitterProvider | null = null;

  constructor({ config, state }: { config?: C; state?: S }) {
    super({ config, state });
    if (!config.chainConfig) throw WalletInitializationError.invalidProviderConfigError("Please provide chainConfig");
    if (!config.chainConfig.chainId) throw WalletInitializationError.invalidProviderConfigError("Please provide chainId inside chainConfig");
    if (!config.chainConfig.rpcTarget) throw WalletInitializationError.invalidProviderConfigError("Please provide rpcTarget inside chainConfig");
    this.defaultState = {
      chainId: "loading",
    } as S;
    this.defaultConfig = {
      chainConfig: config.chainConfig,
      networks: { [config.chainConfig.chainId]: config.chainConfig },
    } as C;
    super.initialize();
  }

  get provider(): SafeEventEmitterProvider | null {
    return this._providerProxy;
  }

  set provider(_: SafeEventEmitterProvider | null) {
    throw new Error("method not implemented");
  }

  abstract setupProvider(provider: T): Promise<SafeEventEmitterProvider>;

  protected abstract lookupNetwork(provider?: T): Promise<string | void>;
}
