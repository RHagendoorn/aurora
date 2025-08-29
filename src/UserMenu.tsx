/*
 * Copyright 2025 New Vector Ltd.
 *
 * SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
 * Please see LICENSE files in the repository root for full details.
 */

import PlusIcon from "@vector-im/compound-design-tokens/assets/web/icons/plus";
import React, {
    type JSX,
    type MouseEventHandler,
    useEffect,
    useState,
} from "react";
import type ClientStore from "./ClientStore";
import BaseAvatar from "./MemberList/BaseAvatar";
import { useClientStoreContext } from "./context/ClientStoreContext";

import { Button, Menu, Separator } from "@vector-im/compound-web";
import styles from "./UserMenu.module.css";
import { useClientStoresContext } from "./context/ClientStoresContext";

function mxcToUrl(mxcUrl: string): string {
    return `${mxcUrl.replace(
        /^mxc:\/\//,
        "https://matrix.org/_matrix/media/v3/thumbnail/",
    )}?width=48&height=48`;
}

interface UserMenuProps {
    onAddAccount: () => void;
}

export function UserMenu({ onAddAccount }: UserMenuProps): JSX.Element {
    const [clientStores] = useClientStoresContext();
    const [clientStore, setClientStore] = useClientStoreContext();
    const avatarUrl = useAvatarUrl(clientStore);
    const [open, setOpen] = useState(false);
    const displayName = useDisplayName(clientStore);

    const hasMultipleAccounts = Object.keys(clientStores).length > 1;
    const otherAccounts = Object.keys(clientStores).filter(
        (id) => id !== clientStore.client?.userId(),
    );

    return (
        <Menu
            title="user menu"
            showTitle={false}
            open={open}
            onOpenChange={setOpen}
            trigger={
                <button
                    type="button"
                    className={styles.button}
                    onClick={() => setOpen((isOpen) => !isOpen)}
                >
                    <BaseAvatar
                        size="32px"
                        name={clientStore.client?.userId()}
                        idName={clientStore.client?.userId()}
                        title={clientStore.client?.userId()}
                        url={avatarUrl}
                        altText={"User"}
                    />
                </button>
            }
        >
            <div className={styles.content}>
                <div className={styles.top}>
                    <BaseAvatar
                        size="88px"
                        name={clientStore.client?.userId()}
                        idName={clientStore.client?.userId()}
                        title={clientStore.client?.userId()}
                        url={avatarUrl}
                        altText={"User"}
                    />
                    <div className={styles.names}>
                        <div>
                            <span className={styles.displayName}>
                                {displayName}
                            </span>
                        </div>
                        <div>
                            <span className={styles.userId}>
                                {clientStore.client?.userId()}
                            </span>
                        </div>
                    </div>
                </div>
                {hasMultipleAccounts && (
                    <>
                        <Separator className={styles.separator} />
                        <ul className={styles.list}>
                            {otherAccounts.map((id) => {
                                const store = clientStores[id];
                                const userId = store.client?.userId();
                                return (
                                    <li key={userId}>
                                        <Account
                                            clientStore={store}
                                            onClick={() => {
                                                setClientStore(store);
                                                setOpen(false);
                                            }}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                        <Separator className={styles.separator} />
                    </>
                )}
                <Button size="sm" kind="secondary" onClick={onAddAccount}>
                    <PlusIcon /> Add account
                </Button>
            </div>
        </Menu>
    );
}

function useAvatarUrl(clientStore: ClientStore): string | undefined {
    const [avatarUrl, setAvatarUrl] = useState<string>();

    useEffect(() => {
        clientStore.client?.avatarUrl()?.then((avatarUrl) => {
            avatarUrl
                ? setAvatarUrl(mxcToUrl(avatarUrl))
                : setAvatarUrl(undefined);
        });
    }, [clientStore]);

    return avatarUrl;
}

function useDisplayName(clientStore: ClientStore): string | undefined {
    const [name, setName] = useState<string>();
    useEffect(() => {
        const load = async () =>
            setName(await clientStore.client?.displayName());
        load();
    }, [clientStore]);

    return name;
}

type AccountProps = {
    clientStore: ClientStore;
    onClick: MouseEventHandler;
};

function Account({ clientStore, onClick }: AccountProps): JSX.Element {
    const avatarUrl = useAvatarUrl(clientStore);
    const displayName = useDisplayName(clientStore);

    return (
        <button className={styles.account} type="button" onClick={onClick}>
            <BaseAvatar
                className={styles.account_avatar}
                size="32px"
                name={clientStore.client?.userId()}
                idName={clientStore.client?.userId()}
                title={clientStore.client?.userId()}
                url={avatarUrl}
                altText={"User"}
            />
            <span className={styles.account_userName}>{displayName}</span>
            <span className={styles.account_userId}>
                {clientStore.client?.userId()}
            </span>
        </button>
    );
}
