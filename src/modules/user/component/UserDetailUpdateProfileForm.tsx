import { useState } from "react"
import { IShopSetting, IShopSettingValidation } from "../../../models/account"

interface Props{

}
const UserDetailUpdateProfileForm = (props: Props) => {
    const [formValues, setFormValues] = useState<IShopSetting>()
    const [validate, setValidate] = useState<IShopSettingValidation>()
    return <></>
}
export default UserDetailUpdateProfileForm