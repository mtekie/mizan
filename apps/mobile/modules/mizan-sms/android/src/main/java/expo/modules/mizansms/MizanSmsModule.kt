package expo.modules.mizansms

import android.content.ContentResolver
import android.database.Cursor
import android.net.Uri
import android.provider.Telephony
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MizanSmsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MizanSms")

    AsyncFunction("readSmsAsync") { senders: List<String>? ->
      val context = appContext.reactContext ?: return@AsyncFunction emptyList<Map<String, Any>>()
      val contentResolver: ContentResolver = context.contentResolver
      val uri: Uri = Telephony.Sms.Inbox.CONTENT_URI
      
      val projection = arrayOf(
        Telephony.Sms.ADDRESS,
        Telephony.Sms.BODY,
        Telephony.Sms.DATE
      )
      
      var selection: String? = null
      var selectionArgs: Array<String>? = null
      
      if (senders != null && senders.isNotEmpty()) {
        selection = senders.joinToString(" OR ") { "${Telephony.Sms.ADDRESS} = ?" }
        selectionArgs = senders.toTypedArray()
      }
      
      val cursor: Cursor? = contentResolver.query(
        uri,
        projection,
        selection,
        selectionArgs,
        "${Telephony.Sms.DATE} DESC LIMIT 1000"
      )
      
      val result = mutableListOf<Map<String, Any>>()
      
      cursor?.use {
        val addressIndex = it.getColumnIndex(Telephony.Sms.ADDRESS)
        val bodyIndex = it.getColumnIndex(Telephony.Sms.BODY)
        val dateIndex = it.getColumnIndex(Telephony.Sms.DATE)
        
        while (it.moveToNext()) {
          val address = if (addressIndex != -1) it.getString(addressIndex) else ""
          val body = if (bodyIndex != -1) it.getString(bodyIndex) else ""
          val date = if (dateIndex != -1) it.getLong(dateIndex) else 0L
          
          result.add(mapOf(
            "address" to address,
            "body" to body,
            "date" to date
          ))
        }
      }
      
      return@AsyncFunction result
    }
  }
}
