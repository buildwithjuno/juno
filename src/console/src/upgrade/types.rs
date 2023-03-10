///
/// Upgrade structure:
///
/// v0.0.1 -> v0.0.2
///
pub mod upgrade {
    use candid::CandidType;
    use serde::Deserialize;
    use shared::types::interface::Controllers;
    use crate::types::state::{InvitationCodes, MissionControls, Payments, Releases};

    #[derive(Default, CandidType, Deserialize, Clone)]
    pub struct UpgradeStableState {
        pub mission_controls: MissionControls,
        pub payments: Payments,
        pub releases: Releases,
        pub invitation_codes: InvitationCodes,
        pub controllers: Controllers,
    }
}
