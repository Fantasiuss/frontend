import { ErrorBoundary, For, Suspense } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";

import { useClient } from "@revolt/client";
import { createOwnBotsResource } from "@revolt/client/resources";
import { modalController } from "@revolt/modal";
import {
  Avatar,
  CategoryButton,
  CategoryButtonGroup,
  Column,
  Preloader,
  iconSize,
} from "@revolt/ui";

import MdLibraryBooks from "@material-design-icons/svg/outlined/library_books.svg?component-solid";
import MdSmartToy from "@material-design-icons/svg/outlined/smart_toy.svg?component-solid";

import { useSettingsNavigation } from "../../Settings";

/**
 * View all owned bots
 */
export function MyBots() {
  return (
    <Column gap="lg">
      <CreateBot />
      <ListBots />
    </Column>
  );
}

/**
 * Prompt to create a new bot
 */
function CreateBot() {
  const client = useClient();
  const { navigate } = useSettingsNavigation();

  return (
    <CategoryButtonGroup>
      <CategoryButton
        action="chevron"
        icon={<MdSmartToy {...iconSize(22)} />}
        onClick={() =>
          modalController.push({
            type: "create_bot",
            client: client(),
            onCreate(bot) {
              navigate(`bots/${bot.id}`);
            },
          })
        }
        description={
          <Trans>
            You agree that your bot is subject to the Acceptable Usage Policy.
          </Trans>
        }
      >
        <Trans>Create Bot</Trans>
      </CategoryButton>
      <CategoryButton
        action="external"
        icon={<MdLibraryBooks {...iconSize(22)} />}
        onClick={() => window.open("https://developers.revolt.chat", "_blank")}
        description={
          <Trans>Learn more about how to create bots on Revolt.</Trans>
        }
      >
        <Trans>Developer Documentation</Trans>
      </CategoryButton>
    </CategoryButtonGroup>
  );
}

/**
 * List owned bots by current user
 */
function ListBots() {
  const { navigate } = useSettingsNavigation();
  const bots = createOwnBotsResource();

  return (
    <ErrorBoundary fallback="Failed to load bots...">
      <Suspense fallback={<Preloader type="ring" />}>
        <CategoryButtonGroup>
          <For each={bots.data}>
            {(bot) => (
              <CategoryButton
                icon={
                  <Avatar
                    src={bot.user!.animatedAvatarURL}
                    size={24}
                    fallback={bot.user!.displayName}
                  />
                }
                onClick={() => navigate(`bots/${bot.id}`)}
                action="chevron"
                // description={bot.id}
              >
                {bot.user!.displayName}
              </CategoryButton>
            )}
          </For>
        </CategoryButtonGroup>
      </Suspense>
    </ErrorBoundary>
  );
}
