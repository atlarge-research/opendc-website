import React from 'react'
import Content from '@theme-original/DocItem/Content'
import Admonition from '@theme/Admonition'
import Head from '@docusaurus/Head'
import Link from '@docusaurus/Link'
import { useDoc } from '@docusaurus/plugin-content-docs/client'

// Every doc in learn/opendc-2/ describes OpenDC2, which is no longer developed. Those pages get a warning and are
// kept out of search engines, so searches lead to the OpenDC3 documentation. The migration guide is where the
// warning points to, so it is left as a normal page.
const OPENDC_2_PREFIX = 'opendc-2/'
const MIGRATION_GUIDE_ID = 'opendc-2/migrating-to-opendc-3'

export default function ContentWrapper(props) {
    const { metadata } = useDoc()
    if (!metadata.id.startsWith(OPENDC_2_PREFIX) || metadata.id === MIGRATION_GUIDE_ID) {
        return <Content {...props} />
    }

    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <Admonition type="warning" title="OpenDC2 is no longer being developed">
                <p>
                    This page documents OpenDC2. OpenDC3 can still run OpenDC2 experiment files with{' '}
                    <code>opendc --legacy run</code>, but new features are only added to OpenDC3. See the{' '}
                    <Link to="/learn/category/documentation">OpenDC3 documentation</Link>, or{' '}
                    <Link to="/learn/opendc-2/migrating-to-opendc-3">Migrating to OpenDC3</Link>.
                </p>
            </Admonition>
            <Content {...props} />
        </>
    )
}
