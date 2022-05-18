import AddressReducer, { namespace as AddressNamespace } from './address/slice';
import ConnectionReducer, { namespace as ConnectionNamespace } from './connection/slice';
import AuthenticationReducer, { namespace as AuthenticationNameSpace } from './authentication/slice';
import ConfigReducer, { namespace as ConfigNamespace } from './config/slice';
import PageReducer, { namespace as PageNamespace } from './page/slice';

const rootReducer = {
  [AddressNamespace]: AddressReducer,
  [ConnectionNamespace]: ConnectionReducer,
  [AuthenticationNameSpace]: AuthenticationReducer,
  [ConfigNamespace]: ConfigReducer,
  [PageNamespace]: PageReducer,
};

export default rootReducer;
