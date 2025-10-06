import { useContext, useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { SiTestrail } from "react-icons/si";
import { FaSyncAlt } from "react-icons/fa";
import InputLabel from "@components/UI/InputLabel";
import CloseButton from "@components/UI/CloseButton";
import SubmitButton from "@components/UI/SubmitButton";
import { InstantsContext } from "@components/Context/InstantsContext";
import { Input } from '@src/components/UI/input';
import { Card, CardContent } from '@src/components/UI/card';
import { Button } from "@src/components/UI/button";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@apollo/client";
import { GetWaAccount, WhatsAppAccountCreate, WhatsAppAccountSave, SyncWhatsAppAccountTemplates, WhatsAppAccountTestConnection } from "@src/generated/graphql";
import { isDefined } from "@src/utils/validation/isDefined";


const WhatsAppAccountForm = ({ onBack, waAccountId }) => {

    const initialFormData = {
        id: "",
        name: "",
        appId: "",
        phoneNumberId: "",
        businessAccountId: "",
        accessToken: "",
        appSecret: "",
        waWebhookToken: ""
    };
    const [formData, setFormData] = useState(initialFormData);
    const [isNewInstants, setIsNewInstants] = useState(false);

    const [whatsAppAccountCreate] = useMutation(WhatsAppAccountCreate);
    const [whatsAppAccountSave] = useMutation(WhatsAppAccountSave);
    const [syncWhatsAppAccountTemplates] = useMutation(SyncWhatsAppAccountTemplates);
    const [whatsAppAccountTestConnection] = useMutation(WhatsAppAccountTestConnection);



    const { data: accountData } = useQuery(GetWaAccount, {
        variables: { waAccountId },
        skip: !waAccountId,   // don’t run if not editing
        fetchPolicy: "cache-and-network",
    });

    useEffect(() => {
        if (accountData?.getWaAccount) {
            setFormData({
                id: accountData.getWaAccount.id,
                name: accountData.getWaAccount.name,
                appId: accountData.getWaAccount.appId,
                phoneNumberId: accountData.getWaAccount.phoneNumberId,
                businessAccountId: accountData.getWaAccount.businessAccountId,
                accessToken: accountData.getWaAccount.accessToken,
                appSecret: accountData.getWaAccount.appSecret,
                waWebhookToken: accountData.getWaAccount.waWebhookToken,
            });
        }
    }, [accountData]);

    const HandleWhatsAppAccountCreate = async () => {
        const { id, __typename, defaultSelected, ...restFormData }: any = formData
        try {
            const response = await whatsAppAccountCreate({
                variables: {
                    whatsAppAccountData: { accountId: id, ...restFormData },
                }
            })

            if (response.data) {
                toast.success("Account Created")
            }
        } catch (err) {
            toast.error(`${err}`);
        }
    }

    const HandleWhatsAppAccountSave = async () => {
        const { id, __typename, defaultSelected, ...restFormData }: any = formData
        try {
            const response = await whatsAppAccountSave({
                variables: {
                    whatsAppAccountData: { accountId: id, ...restFormData },
                }
            })

            if (response.data) {
                toast.success("Changes are saved")
            }
        } catch (err) {
            toast.error(`${err}`);
        }
    }

    const HandleWhatsAppAccountCreateOrSave = async () => {
        if (
            !formData.name ||
            !formData.appId ||
            !formData.appSecret ||
            !formData.phoneNumberId
        ) {
            toast.error('Please fill all required fields before creat account.');
            return false;
        }
        const { id, __typename, defaultSelected, ...restFormData }: any = formData
        if (!id) {
            HandleWhatsAppAccountCreate()
        } else {
            HandleWhatsAppAccountSave()
        }

        return true;
    }

    const HandleWhatsAppAccountSync = async () => {
        const { id, __typename, defaultSelected, ...restFormData }: any = formData

        try {
            const response = await syncWhatsAppAccountTemplates({
                variables: {
                    waAccountId: id,
                }
            })
            if (response.data) {
                toast.success("Sync Successfull")
            }
        } catch (err) {
            toast.error(`${err}`);
        }
    }

    const HandleWhatsAppAccountTestConnection = async () => {
        const { id, __typename, defaultSelected, ...restFormData }: any = formData

        try {
            const response = await whatsAppAccountTestConnection({
                variables: {
                    whatsAppAccountData: { accountId: id, ...restFormData },
                }
            })
            if (response.data) {
                toast.success(`${response.data.WaAccountTestConnection.message}`);
                onBack()
            }
        } catch (err) {
            toast.error(`${err}`);
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardContent className="p-8 space-y-6">

                    <h2 className="text-2xl font-bold text-center">Create New Account</h2>

                    <form className="space-y-4">
                        <Input
                            required={true}
                            type="text"
                            value={formData.name}
                            placeholder="Account Name"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            required={true}
                            type="text"
                            value={formData.appId}
                            placeholder="App ID"
                            onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                        />
                        <Input
                            required={true}
                            type="password"
                            value={formData.appSecret}
                            placeholder="App Secret"
                            onChange={(e) => setFormData({ ...formData, appSecret: e.target.value })}
                        />
                        <Input
                            required={true}
                            type="text"
                            value={formData.phoneNumberId}
                            placeholder="Phone Number ID"
                            onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
                        />
                        <Input
                            required={true}
                            type="text"
                            value={formData.businessAccountId}
                            placeholder="Business Account ID"
                            onChange={(e) => setFormData({ ...formData, businessAccountId: e.target.value })}
                        />
                        <Input
                            required={true}
                            type="password"
                            value={formData.accessToken}
                            placeholder="Access Token"
                            onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                        />
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => {
                                onBack();
                            }}>
                                Cancel
                            </Button>
                            <Button type="button"
                                onClick={async () => {
                                    const saved = await HandleWhatsAppAccountCreateOrSave()
                                    if (saved) {
                                        onBack();
                                    }
                                }
                                }
                            >Save Account</Button>
                            <Button type="button"
                                onClick={async () => {
                                    const saved = await HandleWhatsAppAccountCreateOrSave()
                                    if (saved) {
                                        await HandleWhatsAppAccountSync()
                                        onBack();
                                    }
                                }}
                            >Sync Template </Button>
                            <Button type="button"
                                onClick={async () => {
                                    const saved = await HandleWhatsAppAccountCreateOrSave()
                                    if (saved) {
                                        await HandleWhatsAppAccountTestConnection()
                                        onBack();
                                    }
                                }}
                            > Test Account </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div >
    )
}

export default WhatsAppAccountForm;
