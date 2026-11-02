import { ApprovalSetupFillData } from '../../types/approval-setup-master.types';

const suggest = (query: string, value: string) => ({ query, value });

/** Default PR approval setup used for save tests. */
export function buildApprovalSetupSaveData(uniqueMarker: string): ApprovalSetupFillData {
  return {
    approvalSetupName: `PR Approval ${uniqueMarker}`,
    formName: suggest('Purchase Request', 'Purchase Request'),
    approvalScope: 'Company',
    description: `Automated approval setup ${uniqueMarker}`,
    companyRows: ['Bhilai Steel Plant'],
    docTypeRows: ['Process'],
    levelRows: [
      {
        printingCaption: 'Manager',
        approvalRule: 'ANY',
        users: [
          {
            approverType: 'User',
            approverName: suggest('sai', 'sai-ui'),
            isDefault: true,
          },
        ],
      },
    ],
    status: 'Active',
  };
}

/** Data for update tests — only description changes at runtime. */
export function buildApprovalSetupUpdateData(uniqueMarker: string): ApprovalSetupFillData {
  return {
    ...buildApprovalSetupSaveData(uniqueMarker),
    approvalSetupName: `PR Approval Update ${uniqueMarker}`,
    description: `Initial description ${uniqueMarker}`,
  };
}
