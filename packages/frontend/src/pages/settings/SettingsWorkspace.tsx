import { useRecoilState } from 'recoil'
import {
  FiLink,
} from 'react-icons/fi'

import { PageHeader } from '@src/modules/ui/layout/page/components/PageHeader';
import {
  Breadcrumb,
  BreadcrumbProps,
} from '@src/modules/ui/navigation/bread-crumb/components/Breadcrumb';
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState'


const SettingsWorkspace = () => {
  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);
  const workspaceId = currentUserWorkspace?.id;
  const links = [
      {
        children: `Home`,
        href: `/w/${workspaceId}/dashboard`,
      },
      { children: `General` },
  ]
	return (
		<div>
      <PageHeader className="" title={<Breadcrumb links={links} />}>
    	</PageHeader>
		</div>
	)
}

export default SettingsWorkspace;